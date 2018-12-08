import json
from elasticsearch import Elasticsearch
import pprint

with open('./casts_docs.json') as fileBody:
    castDocs = json.load(fileBody)
es = Elasticsearch(hosts=[{"host": "localhost", "port": 9200}])
pprint.pprint(castDocs)
for doc in castDocs['hits']:
    print(doc['_id'])
    pprint.pprint(doc['_source'])
    es.index(index='casts', doc_type='_doc',
             body=doc['_source'], id=doc['_id'])
