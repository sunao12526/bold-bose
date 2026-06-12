import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly service;
    constructor(service: PostsService);
    create(data: any): Promise<any>;
    findAll(query: any): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, data: any): Promise<any>;
    remove(id: number): Promise<any>;
}
