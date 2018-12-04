import { Client } from 'elasticsearch-browser';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElasticService {
  private client: Client;
  constructor() {
    if (!this.client) {
      this.connect();
    }
  }

  connect() {
    this.client = new Client({ host: 'localhost:9200' });
  }

  search(idx: string, qry: {}) {
    return this.client.search({
      index: idx,
      body: qry
    });
  }

  update(idx: string, id: string, params: {}) {
    return this.client.update({
      index: idx,
      id: id,
      type: 'doc',
      body: {
        doc: params
      }
    });
  }

  childrenOfParent(
    idx: string,
    parentType: string,
    parentID: string,
    sortField: string,
    sortDir: string
  ) {
    const qry = {
      from: 0,
      size: 10,
      query: {
        has_parent: {
          parent_type: parentType,
          query: {
            term: { _id: parentID }
          }
        }
      },
      sort: [{ sortField: { order: sortDir } }]
    };
    this.search(idx, qry);
  }
}
