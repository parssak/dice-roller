import React, { useState } from "react";

type Props = {
  join: (name: string) => void;
};

export default function LoginPanel({ join }: Props) {
  const [input, setInput] = useState("");

  return (
    <div className="pt-24">
      <h1>Join Game</h1>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Name"
          className="p-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              join(input);
            }
          }}
        />
        <button className="px-2 py-1 rounded ml-2 bg-green-200" onClick={() => join(input)}>
          Join
        </button>
      </div>
    </div>
  );
}
