// const express = require('express');
// const app = express();

// app.get('/', (request, response) => {
  
//   });
  
// const urlLogger = (request, response, next) => {
//   console.log('Request URL: ', request.url);
//   next();
// };
    
// const timeLogger = (request, response, next) => {
//   console.log('Datetime:', new Date(Date.now()).toString());
//   next();
// };

// app.use(urlLogger, timeLogger);
//   app.get('/json', (request, response) => {
//   response.status(200).json({"name": "sdfsdfsdf"});
// });

// app.listen(3000,() => {
//   console.log('express intro running on localhost:3000');
// });
          

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000, () => {
  console.log('database is running on localhost:3000');
});

app.get('/api/v1/events', (request, response) => {
  database('eventtracking').select()
    .then((event) => {
      response.status(200).json(event);
    })
    .catch((error) => {
      response.status(500).json({error});
    })
});

app.post('/api/v1/eventtracking/new', (request, response) => {
  const event = request.body;

  for(let requiredParameters of ['send_id', 'receive_id', 'group_id', 'point_value']) {
    if(!event[requiredParameters]) {
      return response
        .status(422)
        .send({ error: `missing parameter ${requiredParameters}`})
    }
  }

  database('eventtracking').insert(event, 'event_id')
    .then(event => {
      response.status(200).json({status: 'success'});
    })
    .catch(error => {
      response.status(500).json({error});
    })
});



app.post('/api/v1/papers', (request, response) => {
  const paper = request.body;
  
  for(let requiredParameters of ['title', 'author']) {
    if(!paper[requiredParameters]) {
      return response
        .status(422)
        .send({ error: `expected some good params but you forgot ${requiredParameters}. that was not a good move`});
    }
  }

  database('papers').insert(paper, 'id')
    .then(paper => {
      response.status(201).json({id: paper[0]});
    })
    .catch(error => {
      response.status(500).json({error});
    });
});


app.get('/api/v1/footnotes', (request, response) => {
  database('footnotes').select()
    .then((footnotes) => {
      response.status(200).json(footnotes);
    })
    .catch((error) => {
      response.status(500).json({error});
    });
});



app.get('/api/v1/papers/:id', (request, response) => {
  database('papers').where('id', request.params.id).select()
    .then(papers => {
      if(papers.length) {
        response.status(200).json(papers);
      } else {
        response.status(404).json({
          error: `could not find paper with an id of ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/footnotes/:id', (request, response) => {
  database('footnotes').where('paper_id', request.params.id).select()
    .then(footnotes => {
      if(footnotes.length) {
        response.status(200).json(footnotes);
      } else {
        response.status(404).json({
          error: `could not find footnotes that belong to paper with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    })
});
