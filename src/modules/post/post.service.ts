import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { Model } from 'mongoose';
import { Video } from './entities/video.schema';
import { TDefaultUser, User } from '../user/user.entity';
import { StorageService } from '../storage/storage.service';
import { Doc } from 'src/types/doc';
import { Genres } from './entities/genre.entity';
import { Techniques } from './entities/technique.entity';
import { getFields } from 'src/libs/query';

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

  async getGenres() {
    return await this.genreModel
      .find()
      .select(getFields<Doc<Genres>>(['_id', 'name']))
      .lean();
  }

  async createGenres(genres: string[]) {
    await this.genreModel.insertMany(genres.map((g) => ({ name: g })));
  }

  async getTechniques() {
    return await this.techniqueModel
      .find()
      .select(getFields<Doc<Techniques>>(['_id', 'name']))
      .lean();
  }

  async createTechniques(techniques: string[]) {
    await this.techniqueModel.insertMany(techniques.map((t) => ({ name: t })));
  }

  async getAllPostsOfUser(userId: string) {
    const res = await this.postsModel
      .find({ user: userId })
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
      .findOne({ _id: postId })
      .populate<{ user: Doc<User> }>('user')
      .lean();
    // if (post?.thumbnail)
    //   post.thumbnail = await this.storageService.getSignedUrl(post.thumbnail);
    return post;
  }

  async getPost(postId: string) {
    const post = await this.postsModel
      .findById(postId)
      .populate('user')
      // .select(getFields<Doc<Post>>(['_id']))
      .lean();
    return post;
  }

  async getFeed() {
    const genres = await this.getGenres();

    const videos = (
      await Promise.all(
        genres.map(async (g) => {
          return await this.postsModel
            .find({ 'categories.genres': g.name })
            .populate<{ user: Doc<User> }>('user')
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
        .filter((v) => v.categories.genres.includes(g.name))
        .slice(0, 4),
    }));
  }
}
