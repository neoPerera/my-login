import axios from "axios";

const Authenticate = async () => {
  const jwtToken = localStorage.getItem("jwt_token");

  try {
    const response = await axios.get(
      `${window.env?.REACT_APP_API_URL}auth/validatejwt`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    return response.data?.isValid ?? false;
  } catch (error) {
    localStorage.removeItem("jwt_token");
    return false;
  }
};

export default Authenticate;
