export default function ClarkChat() {
  return (
    <div className="flex-1 p-4 bg-neutral-800">
      <h2 className="text-lg font-bold">Clark Chat</h2>
      <div className="mt-2 h-64 rounded bg-neutral-900 p-2">
        {/* Chat messages will go here */}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        className="mt-2 w-full rounded bg-neutral-700 p-2"
      />
    </div>
  );
}
