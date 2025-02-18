import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(1);
  const increment = () => setCount((count) => count + 1);

  return (
    <div>
    </div>
  );
}
