import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '1s', target: 5 },
    { duration: '1s', target: 5 },
    { duration: '1s', target: 0 },
  ],
};

export default function () {
  // Fetching questions
  const questionsRes = http.get('http://localhost:4080/qa/questions?product_id=1');
  check(questionsRes, {
    'questions status was 200': (r) => r.status === 200,
  });

  // Assuming the response contains an array of questions, grabbing the ID of the first one
  const questionJson = questionsRes.json();
  let questionId;
  if (questionJson && questionJson.results && questionJson.results.length > 0) {
    questionId = questionJson.results[0].question_id;
  }
  // Fetching answers for a question
  if (questionId) {
    const answersRes = http.get(`http://localhost:4080/qa/questions/${questionId}/answers`);
    check(answersRes, {
      'answers status was 200': (r) => r.status === 200,
    });
  }

  // Adding a question
  const addQuestionRes = http.post('http://localhost:4080/qa/questions', {
    body: 'Sample question body',
    name: 'SampleUser',
    email: 'sample@user.com',
    product_id: 40350,
  });
  check(addQuestionRes, {
    'add question status was 201': (r) => r.status === 201,
  });

  // Adding an answer to a question
  if (questionId) {
    const addAnswerRes = http.post(`http://localhost:4080/qa/questions/${questionId}/answers`, {
      body: 'Sample answer body',
      name: 'SampleUser',
      email: 'sample@user.com',
    });
    check(addAnswerRes, {
      'add answer status was 201': (r) => r.status === 201,
    });
  }
}
