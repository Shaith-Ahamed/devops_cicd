
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuth } from "../contexts/AuthContext";
import { DashboardService } from "../services/DashboardService";

export default function Dashboard() {
  const { currentUser, logout } = useAuth(); 
  const navigate = useNavigate();


  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
  const [courses, setCourses] = useState([]);


  
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [changingPwd, setChangingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError("");
        setLoading(true);

        const [c] = await Promise.all([
          DashboardService.getMyCourses(),
         
      
        ]);

        if (!mounted) return;
        setCourses(c);
        
        setStats(s);
      } catch (e) {
      
        setCourses([
          { id: 1, title: "React Fundamentals", progress: 72 },
          { id: 2, title: "Intro to Databases", progress: 35 },
        ]);
      
        
        setError("Showing demo data (API not reachable).");
      } finally {
        setLoading(false);
      }
    })();


    return () => { mounted = false; };

  }, []);



  const handleLogout = () => {
    logout();
    navigate("/", { replace: true }); 
  };




const handleDelete = async () => {
  setDeleteMsg("");
  if (!currentUser?.userId) {
    setDeleteMsg("User not found.");
    return;
  }

  const ok = window.confirm(
    "This will permanently delete your account and data. Continue?"
  );
  if (!ok) return;

  try {
    setDeleting(true);
    await DashboardService.deleteAccount(currentUser.userId);

   
    await new Promise((r) => setTimeout(r, 600));

    await logout();
    navigate("/", { replace: true });
    
  } catch (err) {
    setDeleteMsg(
      err?.response?.data?.message || err?.message || "Failed to delete account."
    );
  } finally {
    setDeleting(false);
  }
};




  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg("");

    if (!currentPwd || !newPwd) {
      setPwdMsg("Please fill all password fields.");
      return;
    }
    if (newPwd.length < 5) {
      setPwdMsg("New password must be at least 5 characters.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg("New password and confirm password do not match.");
      return;
    }

    try {
      setChangingPwd(true);
      
      const userId =  currentUser.userId ;
      
      await DashboardService.changePassword(userId , currentPwd, newPwd);

      setPwdMsg("Password updated successfully.");
      setCurrentPwd(""); 
      setNewPwd(""); 
      setConfirmPwd("");

    } catch (err) {
      setPwdMsg( (err.response?.data?.message || err.message || "Failed to change password"));
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard uor</h1>
        <p className="text-gray-600 mt-1">
          Welcome{currentUser?.firstName ? `, ${currentUser.firstName}` : ""}! Here’s a snapshot of your learning.
        </p>
        {error && <p className="text-sm text-amber-600 mt-2">{error}</p>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Enrolled Courses</p>
          <p className="text-3xl font-semibold mt-1">{courses.length}</p>
        </div>
   
      </div>

      {/* Enrolled Courses */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Enrolled Courses</h2>
          <Link to="/courses" className="text-indigo-600 hover:underline text-sm">Browse all courses</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="text-gray-600">You’re not enrolled in any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c) => (
              <Link
                key={c.id}
                to={`/courses/${c.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
              >
                <h3 className="font-medium group-hover:text-indigo-700">{c.title}</h3>
                <div className="mt-3">
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-indigo-600 rounded-full"
                      style={{ width: `${c.progress ?? 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Progress: {c.progress ?? 0}%</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

     

      {/* Settings */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Settings</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Username (email)</p>
            <p className="mt-1 font-medium">{currentUser?.email || "—"}</p>
            <p className="text-sm text-gray-500 mt-4">Name</p>
            <p className="mt-1">{[currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") || "—"}</p>

            <div className="mt-6 flex items-center gap-3">
            <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                Log out
            </button>

            
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 ${
                deleting ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </button>

{deleteMsg && (
  <p className={`text-sm mt-2 ${deleting ? "text-gray-600" : "text-amber-600"}`}>
    {deleteMsg}
  </p>
)}

            </div>

          </div>
          {deleteMsg && <p className="text-sm mt-1">{deleteMsg}</p>}





          {/* Chnge passrd */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-medium mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Current password</label>
                <input
                  type="password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Current password"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">New password</label>
                  <input
                    type="password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="New password"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Confirm new password</label>
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              {pwdMsg && <p className="text-sm mt-1">{pwdMsg}</p>}

              <button
                type="submit"
                disabled={changingPwd} //disable while typing
                className={`mt-2 inline-flex items-center justify-center rounded-md px-4 py-2 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  changingPwd ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {changingPwd ? "Updating..." : "Update password"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}




