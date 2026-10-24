const { classifyQuestion } = require("./classifierService");
const { retrieveData, collectImageCandidates } = require("./retrieverService");
const { generateAnswer } = require("./responseService");

// `history` is an optional array of prior turns in this conversation:
// [{ question: "...", answer: "..." }, ...], oldest first. The client
// is responsible for sending it back each request (no server-side
// session storage exists in this project yet).
exports.askQuestion = async (question, history = []) => {

    const classification = await classifyQuestion(question, history);
    const results = await retrieveData(classification.requests);
    const imageCandidates = collectImageCandidates(results);
    const answer = await generateAnswer(question, classification, results, history, imageCandidates);

    return {
        question,
        topics: classification.requests.map(request => request.topic),
        retrievedData: results,
        answer
    };

};