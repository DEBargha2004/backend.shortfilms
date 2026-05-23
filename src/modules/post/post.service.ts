import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { Model } from 'mongoose';
import { Video } from './entities/video.schema';
import { User } from '../user/user.entity';
import { StorageService } from '../storage/storage.service';
import { Doc } from 'src/types/doc';
import { Genres } from './entities/genre.entity';
import { Techniques } from './entities/technique.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postsModel: Model<Post>,
    @InjectModel(Genres.name) private readonly genreModel: Model<Genres>,
    @InjectModel(Techniques.name)
    private readonly techniqueModel: Model<Techniques>,
    private readonly storageService: StorageService,
  ) {}

  async createPost(userId: string, postdata: CreatePostDto) {
    return (
      await this.postsModel.insertOne({
        title: postdata.title,
        description: postdata.description,
        video: postdata.video as Video,
        trailer: postdata.trailer as Video,
        categories: postdata.categories,
        credits: postdata.credits,
        details: postdata.details,
        playlist: postdata.playlist,
        publishingOption: postdata.publishingOption,
        schedulingOption: postdata.schedulingOption,
        thumbnail: postdata.thumbnail,
        press: postdata.press,
        user: userId,
      })
    ).toObject();
  }

  async updatePost(postId: string, postdata: CreatePostDto) {
    const res = await this.postsModel
      .findByIdAndUpdate(postId, {
        title: postdata.title,
        description: postdata.description,
        video: postdata.video as Video,
        trailer: postdata.trailer as Video,
        categories: postdata.categories,
        credits: postdata.credits,
        details: postdata.details,
        playlist: postdata.playlist,
        publishingOption: postdata.publishingOption,
        schedulingOption: postdata.schedulingOption,
        thumbnail: postdata.thumbnail,
        press: postdata.press,
      })
      .lean();

    return res;
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.getPost(postId);
    if (!post) throw new NotFoundException('Post not found');

    if (post.user.role !== 'admin' && post.user._id.toString() !== userId)
      throw new UnauthorizedException('Unauthorized');

    await this.postsModel.findByIdAndUpdate(postId, {
      deletedAt: new Date(),
    });
  }

  async setVerification(postId: string, status: boolean) {
    const post = await this.postsModel
      .findByIdAndUpdate(
        postId,
        {
          verifiedAt: status ? new Date() : null,
        },
        { new: true },
      )
      .lean();
    return post;
  }

  async getAllPostsAdmin() {
    const res = await this.postsModel
      .find({ deletedAt: null })
      .populate('user')
      .populate('categories.genres')
      .populate('categories.techniques')
      .sort({ createdAt: -1 })
      .lean();
    return await Promise.all(
      res.map(async (p) => ({
        ...p,
        thumbnail: p.thumbnail
          ? await this.storageService.getSignedUrl(p.thumbnail)
          : p.thumbnail,
      })),
    );
  }

  async getAllPostsOfUser(userId: string) {
    const res = await this.postsModel
      .find({ user: userId, deletedAt: null })
      .populate('categories.genres')
      .populate('categories.techniques')
      .sort({ createdAt: -1 })
      .lean();
    return await Promise.all(
      res.map(async (p) => ({
        ...p,
        thumbnail: await this.storageService.getSignedUrl(p.thumbnail),
      })),
    );
  }

  async getPostofCreator(postId: string) {
    const post = await this.postsModel
      .findOne({ _id: postId, deletedAt: null })
      .populate<{ user: Doc<User> }>('user')
      .populate('categories.genres')
      .populate('categories.techniques')
      .lean();
    // if (post?.thumbnail)
    //   post.thumbnail = await this.storageService.getSignedUrl(post.thumbnail);
    return post;
  }

  async getPost(postId: string) {
    const post = await this.postsModel
      .findOne({ _id: postId, deletedAt: null })
      .populate<{ user: Doc<User> }>('user')
      .populate('categories.genres')
      .populate('categories.techniques')
      // .select(getFields<Doc<Post>>(['_id']))
      .lean();
    return post;
  }

  async getFeed() {
    const genres = await this.findAllGenres();

    const videos = (
      await Promise.all(
        genres.map(async (g) => {
          return await this.postsModel
            .find({
              'categories.genres': g._id,
              deletedAt: null,
              verifiedAt: { $ne: null },
            })
            .populate<{ user: Doc<User> }>('user')
            .populate('categories.genres')
            .populate('categories.techniques')
            .limit(4)
            .lean();
        }),
      )
    ).flat(2);

    const uniqVideos = Array.from(
      new Map(videos.map((v) => [v._id.toString(), v])).values(),
    );

    const uniqVideosWithThumbnail = await Promise.all(
      uniqVideos.map(async (v) => {
        v.thumbnail = await this.storageService.getSignedUrl(v.thumbnail);
        return v;
      }),
    );

    return genres.map((g) => ({
      id: g._id,
      name: g.name,
      contents: uniqVideosWithThumbnail
        .filter((v: any) =>
          v.categories.genres.some(
            (genre: any) => genre._id.toString() === g._id.toString(),
          ),
        )
        .slice(0, 4),
    }));
  }

  // Genre Methods
  async createGenre(createGenreDto: any) {
    const existing = await this.genreModel
      .findOne({ name: createGenreDto.name })
      .exec();
    if (existing) throw new Error('Genre already exists');
    const genre = await this.genreModel.create({ name: createGenreDto.name });
    return genre.toObject();
  }

  async findAllGenres() {
    const genres = await this.genreModel.find().exec();
    return genres.map((g) => g.toObject());
  }

  async findOneGenre(id: string) {
    const genre = await this.genreModel.findById(id).exec();
    if (!genre) throw new Error('Genre not found');
    return genre.toObject();
  }

  async updateGenre(id: string, updateGenreDto: any) {
    const genre = await this.genreModel
      .findByIdAndUpdate(id, { name: updateGenreDto.name }, { new: true })
      .exec();
    if (!genre) throw new Error('Genre not found');
    return genre.toObject();
  }

  async removeGenre(id: string) {
    const genre = await this.genreModel.findByIdAndDelete(id).exec();
    if (!genre) throw new Error('Genre not found');
    return genre.toObject();
  }

  // Technique Methods
  async createTechniqueSingle(createTechniqueDto: any) {
    const existing = await this.techniqueModel
      .findOne({ name: createTechniqueDto.name })
      .exec();
    if (existing) throw new Error('Technique already exists');
    const tech = await this.techniqueModel.create({
      name: createTechniqueDto.name,
    });
    return tech.toObject();
  }

  async findAllTechniques() {
    const techs = await this.techniqueModel.find().exec();
    return techs.map((t) => t.toObject());
  }

  async findOneTechnique(id: string) {
    const tech = await this.techniqueModel.findById(id).exec();
    if (!tech) throw new Error('Technique not found');
    return tech.toObject();
  }

  async updateTechnique(id: string, updateTechniqueDto: any) {
    const tech = await this.techniqueModel
      .findByIdAndUpdate(id, { name: updateTechniqueDto.name }, { new: true })
      .exec();
    if (!tech) throw new Error('Technique not found');
    return tech.toObject();
  }

  async removeTechnique(id: string) {
    const tech = await this.techniqueModel.findByIdAndDelete(id).exec();
    if (!tech) throw new Error('Technique not found');
    return tech.toObject();
  }
}
