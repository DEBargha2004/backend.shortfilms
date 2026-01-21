import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/types/jwt-payload';
import { PostService } from '../post.service';

@Injectable()
export class UpdatePostGuard implements CanActivate {
  constructor(private readonly postService: PostService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user as JwtPayload;
    const postId = req.params.id;

    if (user.role === 'admin' || user.role === 'moderator') return true;

    const post = await this.postService.getPostofCreator(postId);
    if (post?.user && post.user._id.toString() === user.userId) return true;

    return false;
  }
}
