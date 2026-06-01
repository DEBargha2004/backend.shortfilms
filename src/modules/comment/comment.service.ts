import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './entities/comment.entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { User } from 'src/modules/user/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Post.name) private readonly postsModel: Model<Post>,
  ) {}

  async createComment(userId: string, dto: CreateCommentDto) {
    const post = await this.postsModel.findOne({
      _id: dto.postId,
      deletedAt: null,
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const createdComment = await this.commentModel.create({
      user: userId,
      post: dto.postId,
      content: dto.content,
    });

    // Update post comments count cache
    await this.postsModel.findByIdAndUpdate(dto.postId, {
      $inc: { commentsCount: 1 },
    });

    const populated = await createdComment.populate<{ user: User }>({
      path: 'user',
      select: 'name image',
    });

    return populated.toObject();
  }

  async getCommentsForPost(postId: string) {
    const comments = await this.commentModel
      .find({ post: postId, deletedAt: null })
      .populate<{ user: User }>({
        path: 'user',
        select: 'name image',
      })
      .sort({ createdAt: -1 })
      .lean();

    return comments;
  }

  async deleteComment(commentId: string, userId: string, userRole: string) {
    const comment = await this.commentModel.findOne({
      _id: commentId,
      deletedAt: null,
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const post = await this.postsModel.findById(comment.post).lean();
    if (!post) {
      throw new NotFoundException('Post associated with the comment not found');
    }

    // Permission check: comment author, post author, or admin
    const isCommentAuthor = comment.user.toString() === userId;
    const isPostAuthor = post.user.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }

    await this.commentModel.findByIdAndUpdate(commentId, {
      deletedAt: new Date(),
    });

    // Update post comments count cache
    await this.postsModel.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -1 },
    });

    return { message: 'Comment deleted successfully' };
  }
}
