
import http from "./http";

export const DashboardService = {

  getMyCourses: async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.userId) {
      throw new Error("User not logged in");
    }
    const response = await http.get(`/enrollments/user/${user.userId}`);
    return response.data;
  },



  changePassword: async (userId, currentPassword, newPassword) => {
    const { data } = await http.put(`/users/updateUser/${userId}/password`, {
      currentPassword, 
      newPassword,
    });
    return data;

  },


  deleteAccount(userId) {
    return http.delete(`/users/removeUser/${userId}`);
  },





  
  
};




