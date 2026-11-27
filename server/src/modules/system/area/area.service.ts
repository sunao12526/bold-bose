import { Injectable } from '@nestjs/common';
import { IpService } from '../../../shared/ip/ip.service';
import { AreaNode, CHINA_AREA_TREE } from './area-data';

@Injectable()
export class AreaService {
  private readonly nodeMap = new Map<number, AreaNode>();
  private readonly pathMap = new Map<number, string[]>();

  constructor(private readonly ipService: IpService) {
    this.buildIndex(CHINA_AREA_TREE, []);
  }

  private buildIndex(nodes: AreaNode[], parents: string[]) {
    for (const node of nodes) {
      const currentPath = [...parents, node.name];
      this.nodeMap.set(node.id, node);
      this.pathMap.set(node.id, currentPath);
      if (node.children && node.children.length > 0) {
        this.buildIndex(node.children, currentPath);
      }
    }
  }

  getTree(): AreaNode[] {
    return CHINA_AREA_TREE;
  }

  getById(id: number): AreaNode | null {
    return this.nodeMap.get(id) ?? null;
  }

  format(id: number, separator = ' '): string {
    const parts = this.pathMap.get(id);
    return parts ? parts.join(separator) : '';
  }

  async getAreaByIp(ip: string): Promise<{ ip: string; area: string }> {
    const area = await this.ipService.search(ip);
    return { ip, area: area || '未知区域' };
  }
}
