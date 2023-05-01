export function handleInputChange(event, state, setState) {
  const { name, value } = event.target;
  setState({
    ...state,
    [name]: value,
  });
}

export function handleFormSubmit(event) {
  event.preventDefault();
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

export function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch (error) {
    return null;
  }
}
