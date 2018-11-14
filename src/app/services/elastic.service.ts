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
    console.log(idx, qry);
    return this.client.search({
      index: idx,
      body: qry
    });
  }
}
