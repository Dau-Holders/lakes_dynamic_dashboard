export default function IndividualArticle({
  params,
}: {
  params: { id: string };
}) {
  console.log(params);
  return (
    <div>
      <p>Hello World</p>
    </div>
  );
}
