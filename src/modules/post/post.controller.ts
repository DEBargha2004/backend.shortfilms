import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post';
import { ApiBody } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user';
import { JwtPayload } from 'src/types/jwt-payload';
import { PostService } from './post.service';
import { UpdatePostGuard } from './guards/update-post';
import { CreatePostCategoriesDto } from './dto/categories';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('feed')
  async getFeed() {
    return await this.postService.getFeed();
  }

  @UseGuards(JwtAuthGuard, UpdatePostGuard)
  @Get('creator/:id')
  async getPostOfCreator(@Param('id') id: string) {
    return await this.postService.getPostofCreator(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiBody({ type: CreatePostDto })
  async createPost(@Body() postDto: CreatePostDto, @User() user: JwtPayload) {
    const res = await this.postService.createPost(user.userId, postDto);
    return { message: 'Post Created Successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllPosts(@User() user: JwtPayload) {
    const res = await this.postService.getAllPostsOfUser(user.userId);
    return res;
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    const post = await this.postService.getPost(id);
    return post;
  }

  @UseGuards(JwtAuthGuard, UpdatePostGuard)
  @Put(':id/edit')
  async updatePost(@Param('id') id: string, @Body() postData: CreatePostDto) {
    const res = await this.postService.updatePost(id, postData);
    return { message: 'Post Updated successfully' };
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {}

  @Get('categories/genre')
  async getGenres() {
    return await this.postService.getGenres();
  }

  @Post('categories/genre')
  async createGenres(@Body() genres: CreatePostCategoriesDto) {
    await this.postService.createGenres(genres.data);
    return { message: 'Genres created successfully' };
  }

  @Get('categories/technique')
  async getTechnique() {
    return await this.postService.getTechniques();
  }

  @Post('categories/technique')
  async createTechnique(@Body() genres: CreatePostCategoriesDto) {
    await this.postService.createTechniques(genres.data);
    return { message: 'Techniques created successfully' };
  }
}
