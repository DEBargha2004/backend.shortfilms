import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Auth } from '../auth/auth.guard';
import { User } from 'src/common/decorators/user';
import { TJwtToken } from 'src/types/jwt-payload';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Auth()
  @Post()
  async createComment(@Body() dto: CreateCommentDto, @User() user: TJwtToken) {
    return await this.commentService.createComment(user.sub, dto);
  }

  @Get('post/:postId')
  async getComments(@Param('postId') postId: string) {
    const comments = await this.commentService.getCommentsForPost(postId);
    return { data: comments };
  }

  @Auth()
  @Delete(':id')
  async deleteComment(@Param('id') id: string, @User() user: TJwtToken) {
    return await this.commentService.deleteComment(id, user.sub, user.role);
  }
}
