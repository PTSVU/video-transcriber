import './github-avatar.css';

export default function GithubAvatar({ username, size = "60px" }) {
    if (!username) return null;

  const avatarUrl = `https://github.com/${username}.png?size=${size}`;

  return (
      <img
        src={avatarUrl}
        alt={`GitHub avatar of ${username}`}
        className="github-avatar"
        onError="/github-logo.png"
      />
  );
}