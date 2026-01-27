import http from "./http";



const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
};

class CourseService {
  
  async getAllCourses() {
    try {
      const { data } = await http.get(`courses/getAllCourses`, { headers: authHeader() });
      return data;
    } catch (err) {
     
      throw err;
    }
  }
  




  async getCourseById(id) {
    try {
      const response = await http.get(`courses/getCourseById/${id}`, { 
        headers: authHeader() 
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }




  }



  async enroll(courseId) {
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      throw new Error("User not logged in or user.id missing");
    }

    
    const body = {
      userId: user.id,
      courseId: Number(courseId),
    };


    const response = await http.post(`/enrollments/doEnrollment`, body);
    return response.data;
  }





}

export default new CourseService();













