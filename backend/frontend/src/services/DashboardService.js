
import http from "./http";

export const DashboardService = {
  getMyCourses: () =>
    http.get("/users/me/courses").then(r => r.data),





  changePassword: async (userId, currentPassword, newPassword) => {
    const { data } = await http.put(`/users/updateUser/${userId}/password`, {
      currentPassword, //the body parts expected by the put mapping in the srpingboot
      newPassword,
    });
    return data;

  },


  deleteAccount(userId) {
    return http.delete(`/users/removeUser/${userId}`);
  },





  
  
};
