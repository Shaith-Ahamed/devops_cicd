
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseService from "../services/CourseService";


function mapCourse(raw) {
  if (!raw) return null;
  return {
    id:          raw.id ?? raw.courseId ?? raw._id,
    title:       raw.title ?? raw.name ?? raw.category,
    
    description: raw.description ?? raw.details ?? raw.category_description ?? "",
    imageUrl:    raw.image_url ?? raw.imageUrl ?? raw.bannerUrl,

    price:       raw.price ?? raw.amount ?? 0,
    
   
   
   
    category:    raw.category ?? raw.title ?? "",
  };
}

export default function CourseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
      
        const raw = await CourseService.getCourseById(id); 
        const normalized = mapCourse(raw);

        if (!ignore) setCourse(normalized);
      } catch (e) {
        console.error("Failed to load course", { id, error: e });
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [id]);

  async function handleEnroll() {
    try {
      setEnrolling(true);
      await CourseService.enroll(id);
      alert("Enrollment successful ");
      navigate("/dashboard");
    } catch (e) {
      alert(e?.response?.data?.message ?? "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;
  if (!course)  return <div className="max-w-7xl mx-auto px-4 py-8">Course not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
     
      <div className="lg:col-span-2">
        

        <section className="mt-8">
          <h2 className="text-xl font-semibold">What you’ll learn</h2>
          <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-2">
            {(course.learn || [
              "Master the fundamentals of Development.",
              "Build real‑world projects and applications.",
              "Understand advanced concepts and best practices.",
              "Prepare for a career in development."
            ]).map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Requirements</h2>
          <ul className="mt-3 space-y-2">
            {(course.requirements || [
              "A computer with internet access.",
              ,
              "Eagerness to learn!",
            ]).map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-400"></span>
                <span className="text-slate-700">{r}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

     
      <aside className="lg:col-span-1">
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <img
            src={ course.imageUrl }
            alt="Course img"
            className="w-full h-52 object-cover"
          />
          <div className="p-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                {"$" + (course.price)}
              </span>
             
            </div>

            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {enrolling ? "Enrolling..." : "Enroll Now"}
            </button>

            <p className="text-xs text-slate-500 mt-2">30‑Day Money‑Back Guarantee</p>

            <ul className="mt-6 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
             48.5 hours on‑demand video
              </li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Full lifetime access</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Access on mobile and TV</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Certificate of completion</li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
