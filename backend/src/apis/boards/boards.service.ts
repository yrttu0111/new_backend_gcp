import { BoardCategory } from 'src/apis/boardCategory/entities/boardCategory.entity';
import { Board } from './entities/board.entity';

import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardTag } from '../boardTag/entities/boardTag.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardCategory)
    private readonly boardCategoryRepository: Repository<BoardCategory>,
    @InjectRepository(BoardTag)
    private readonly boardTagRepository: Repository<BoardTag>,
  ) {}
  async findAll() {
    const result = await this.boardRepository.find({
      relations: [
      'boardCategory',
       'boardTags',
        'user'
      ],
    });
    console.log(result)
    return result;
  }
  findOne({number}) {
    const result = this.boardRepository.findOne({
      where: { number: number },
      relations: [
      'boardCategory',
      'boardTags',
      'user'
    ],
    });

    return result;
  }
  


  async create({ createBoardInput, user }) {
    const { boardCategoryId, boardTags, ...board } = createBoardInput;
    const result2 = []
    for (let i = 0; i < boardTags.length; i++) {
      const tagname = boardTags[i].replace('#', ''); //
      //이미 등록된 태그인지 확인
      const prevTag = await this.boardTagRepository.findOne({
        name: tagname,
      });
      if (prevTag) {
        result2.push(prevTag);
      } else {
        const newTag = await this.boardTagRepository.save({ name: tagname });
        result2.push(newTag);
      }
    }
    const result = await this.boardRepository.save({
      ...board,
      boardCategory: { id: boardCategoryId },
      boardTags: result2,
      user: {id: user.id},
    });
    return result;
  }
  async update({  updateBoardInput, number }) {
    //모든 값을 내보내기 위해 안하면 바뀐값만 리턴됨
    const myBoard = await this.boardRepository.findOne({
      where: { number: number },
    });
    const newProduct = {
      ...myBoard,
      id: number,
      ...updateBoardInput,
    };
    return this.boardRepository.save(newProduct);
  }
  async delete({ number }) {
    // soft delete - deleteAt 컬럼에 삭제된 날짜가 들어감 실제 삭제 아님
    const result = await this.boardRepository.softDelete({ number: number });
    return result.affected ? true : false;
  }
}
