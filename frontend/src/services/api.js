import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000", // Replace with your backend server URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export async function login(username, password) {
  try {
    const response = await api.post("/auth/login", { username, password });
    const token = response.data.access_token;
    setAuthToken(token);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export async function register(username, password, role) {
  try {
    const response = await api.post("auth/register", { username, password, role });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export async function getGroups() {
  const response = await api.get("/teacher/groups");
  return response;
}

export async function getQuizzes() {
  const response = await api.get("/teacher/quizzes");
  return response;
}

export async function getUserRole() {
  const response = await api.get("/user/role");
  return response;
}

export async function createGroup(groupData) {
  try {
    const response = await api.post("/teacher/groups", groupData);
    return response.data;
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
}

export async function deleteGroup(groupId) {
  try {
    const response = await api.delete(`/teacher/groups/${groupId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete group", error);
    throw error;
  }
}

export const getAllStudents = async () => {
  try {
    const response = await api.get("/teacher/students"); // Update the endpoint according to your API
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};

export async function getGroup(groupId) {
  const response = await api.get(`/teacher/groups/${groupId}`);
  return response.data;
}


export async function createQuiz(quizData) {
  const response = await api.post("/teacher/quiz/create", quizData);
  return response.data;
}

export async function getQuiz(quizId) {
  const response = await api.get(`/teacher/quiz/${quizId}`);
  return response.data;
}



export async function deleteQuiz(quizId) {
  try {
    const response = await api.delete(`/teacher/quiz/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete quiz", error);
    throw error;
  }
}

export async function logout() {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export async function checkTokenValidity() {
  try {
      const response = await api.get('/auth/token/validity');
      return response.data.valid;
  } catch (error) {
      return false;
  }
}


export function getQuiz_student(quizId) {
  return api.get(`/student/quizzes/${quizId}`)
      .then(response => response.data);
}

export function startQuiz(quizId) {
  return api.post(`/student/quizzes/${quizId}/start`)
      .then(response => response.data);
}

export function submitAnswer(attemptId, questionId, option, quizId) {
  return api.post(`/student/quizzes/${quizId}/submit-answer`, {
      attempt_id: attemptId,
      question_id: questionId,
      option: option
  }).then(response => response.data);
}

export function finishQuiz(attemptId, quizId) {
  return api.post(`/student/quizzes/${quizId}/finish`, {
      attempt_id: attemptId
  }).then(response => response.data);
}

export function getQuizzes_student() {
  return api.get(`/student/quizzes`)
      .then(response => response.data);
}


export function verifyQuizCode(quizId, accessCode) {
  return api.post(`/student/quizzes/${quizId}/access`, { access_code: accessCode })
      .then(response => response.data.message === 'Access granted')
      .catch(() => false);
}


export function getQuizResults(quizId) {
  return api.get(`/student/quizzes/${quizId}/results`)
      .then(response => response.data);
}

export function getQuizStatus(quizId) {
  return api.get(`/student/quizzes/${quizId}/status`)
      .then(response => response.data.status);
}

export function startGroupQuiz(quizId) {
  return api.post(`/student/group-quizzes/${quizId}/start`)
      .then(response => response.data);
}

export function submitGroupAnswer(attemptId, questionId, option, quizId) {
  return api.post(`/student/group-quizzes/${quizId}/submit-answer`, {
      attempt_id: attemptId,
      question_id: questionId,
      option: option
  }).then(response => response.data);
}

export function finishGroupQuiz(attemptId, quizId) {
  return api.post(`/student/group-quizzes/${quizId}/finish`, {
      attempt_id: attemptId
  }).then(response => response.data);
}

export function getGroupQuizResults(quizId) {
  return api.get(`/student/group-quizzes/${quizId}/results`)
      .then(response => response.data);
}

export function getGroupQuizStatus(quizId) {
  return api.get(`/student/group-quizzes/${quizId}/status`)
      .then(response => response.data.status);
}

export const getGroupQuizzes = async () => {
  try {
      const response = await api.get("/student/group-quizzes");
      return response.data;
  } catch (error) {
      console.error("Error fetching group quizzes:", error);
      return [];
  }
};

export function getQuiz_group(quizId) {
  return api.get(`/student/group-quizzes/${quizId}`)
      .then(response => response.data);
}

export default api;
