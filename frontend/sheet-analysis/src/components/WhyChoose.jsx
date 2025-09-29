/* eslint-disable no-unused-vars */
import { motion }from "framer-motion";
import '../styles/WhyChoose.css';

const reasons = [
  { icon: "⚙️", title: "Intuitive Interface" },
  { icon: "🔍", title: "Deep Analytics" },
  { icon: "💼", title: "Trusted Security" },
  { icon: "📈", title: "Real-time Reports" }
];

function WhyChoose() {
  return (
    <div className="why-choose">
      <h2>Why DataSense?</h2>
      <div className="why-grid">
        {reasons.map((reason, index) => (
          <motion.div 
            className="why-card"
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="icon">{reason.icon}</div>
            <h3>{reason.title}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default WhyChoose;
