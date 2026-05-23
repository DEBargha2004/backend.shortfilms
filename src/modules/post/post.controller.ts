import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { CreateTechniqueDto } from './dto/create-technique.dto';
import { CreatePostDto } from './dto/create-post';
import { ApiBody } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user';
import { TJwtToken } from 'src/types/jwt-payload';
import { PostService } from './post.service';
import { Auth } from '../auth/auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('feed')
  async getFeed() {
    return await this.postService.getFeed();
  }

  @Get('creator/:id')
  async getPostOfCreator(@Param('id') id: string) {
    return await this.postService.getPostofCreator(id);
  }

  @Auth()
  @Post('create')
  @ApiBody({ type: CreatePostDto })
  async createPost(@Body() postDto: CreatePostDto, @User() user: TJwtToken) {
    await this.postService.createPost(user.sub, postDto);
    return { message: 'Post Created Successfully' };
  }

  @Auth()
  @Get('all')
  async getAllPosts(@User() user: TJwtToken) {
    const res = await this.postService.getAllPostsOfUser(user.sub);
    return res;
  }

  @Auth('post.read')
  @Get('admin/all')
  async getAllPostsAdmin() {
    const res = await this.postService.getAllPostsAdmin();
    return res;
  }

  @Auth('post.verify')
  @Put(':id/verify')
  async verifyPost(@Param('id') id: string, @Body('status') status: boolean) {
    await this.postService.setVerification(id, status);
    return { message: 'Verification status updated successfully' };
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    const post = await this.postService.getPost(id);
    return post;
  }

  @Auth()
  @Put(':id/edit')
  async updatePost(@Param('id') id: string, @Body() postData: CreatePostDto) {
    await this.postService.updatePost(id, postData);
    return { message: 'Post Updated successfully' };
  }

  @Auth()
  @Delete(':id')
  async deletePost(@Param('id') id: string, @User() user: TJwtToken) {
    await this.postService.deletePost(id, user.sub);
    return { message: 'Post deleted successfully' };
  }

  // Genre Single CRUD endpoints
  @Auth('genre.create')
  @Post('genre')
  @HttpCode(HttpStatus.CREATED)
  async createGenreSingle(@Body() createGenreDto: CreateGenreDto) {
    const res = await this.postService.createGenre(createGenreDto);
    return {
      message: 'Genre created successfully',
      data: { id: res._id, name: res.name },
    };
  }

  @Auth('genre.read')
  @Get('genre/all')
  @HttpCode(HttpStatus.OK)
  async findAllGenres() {
    const res = await this.postService.findAllGenres();
    return {
      data: res.map((c: any) => ({
        id: c._id,
        name: c.name,
        createdAt: c.createdAt,
      })),
    };
  }

  @Auth('genre.read')
  @Get('genre/:id')
  @HttpCode(HttpStatus.OK)
  async findOneGenre(@Param('id') id: string) {
    const res = await this.postService.findOneGenre(id);
    return {
      data: { id: res._id, name: res.name, createdAt: res.createdAt },
    };
  }

  @Auth('genre.update')
  @Put('genre/:id')
  @HttpCode(HttpStatus.OK)
  async updateGenre(
    @Param('id') id: string,
    @Body() updateGenreDto: CreateGenreDto,
  ) {
    const res = await this.postService.updateGenre(id, updateGenreDto);
    return {
      message: 'Genre updated successfully',
      data: { id: res._id, name: res.name },
    };
  }

  @Auth('genre.delete')
  @Delete('genre/:id')
  @HttpCode(HttpStatus.OK)
  async removeGenre(@Param('id') id: string) {
    await this.postService.removeGenre(id);
    return { message: 'Genre deleted successfully' };
  }

  // Technique Single CRUD endpoints
  @Auth('technique.create')
  @Post('technique')
  @HttpCode(HttpStatus.CREATED)
  async createTechniqueSingle(@Body() createTechDto: CreateTechniqueDto) {
    const res = await this.postService.createTechniqueSingle(createTechDto);
    return {
      message: 'Technique created successfully',
      data: { id: res._id, name: res.name },
    };
  }

  @Auth('technique.read')
  @Get('technique/all')
  @HttpCode(HttpStatus.OK)
  async findAllTechniques() {
    const res = await this.postService.findAllTechniques();
    return {
      data: res.map((c: any) => ({
        id: c._id,
        name: c.name,
        createdAt: c.createdAt,
      })),
    };
  }

  @Auth('technique.read')
  @Get('technique/:id')
  @HttpCode(HttpStatus.OK)
  async findOneTechnique(@Param('id') id: string) {
    const res = await this.postService.findOneTechnique(id);
    return {
      data: { id: res._id, name: res.name, createdAt: res.createdAt },
    };
  }

  @Auth('technique.update')
  @Put('technique/:id')
  @HttpCode(HttpStatus.OK)
  async updateTechnique(
    @Param('id') id: string,
    @Body() updateTechDto: CreateTechniqueDto,
  ) {
    const res = await this.postService.updateTechnique(id, updateTechDto);
    return {
      message: 'Technique updated successfully',
      data: { id: res._id, name: res.name },
    };
  }

  @Auth('technique.delete')
  @Delete('technique/:id')
  @HttpCode(HttpStatus.OK)
  async removeTechnique(@Param('id') id: string) {
    await this.postService.removeTechnique(id);
    return { message: 'Technique deleted successfully' };
  }
}
