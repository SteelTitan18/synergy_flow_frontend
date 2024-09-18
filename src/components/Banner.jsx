export default function Banner({ title }) {
  return (
    <div className="flex flex-col mb-5 justify-items-start">
      <h1 className="page-title">{title}</h1>
    </div>
  );
}
