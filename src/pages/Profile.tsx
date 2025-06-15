
const Profile = () => (
  <div className="flex items-center justify-center h-screen bg-quiz-bg">
    <div className="bg-white px-8 py-6 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-2 font-poppins text-quiz-purple">Profile</h2>
      <div className="text-gray-700">This is where user info/profile will show.</div>
      <div className="mt-4 text-xs text-gray-400">Since you opted for basic auth only, profile info is minimal.</div>
    </div>
  </div>
);
export default Profile;
