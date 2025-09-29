import { useState, useEffect } from "react";
import '../styles/Home.css';

const testimonialsData = [
  { text: "DataSense transformed the way we handle reports!", user: "Rohit Sharma" },
  { text: "The AI insights are spot on and really helpful.", user: "Suresh Raina" },
  { text: "I love how easy it is to manage files and share with my team.", user: "Virat Kholi" },
  { text: "A reliable platform with secure storage options.", user: "M.S Dhoni" }
];

function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % testimonialsData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="testimonials-carousel">
      <div className="testimonial active">
        <p>"{testimonialsData[index].text}"</p>
        <h4>- {testimonialsData[index].user}</h4>
      </div>
    </div>
  );
}

export default Testimonials;
