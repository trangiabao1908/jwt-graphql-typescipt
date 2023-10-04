import {
  isRouteErrorResponse,
  useRouteError,
  useNavigate,
} from "react-router-dom";

export default function ErrorLayout() {
  const error = useRouteError() as Error;
  const navigate = useNavigate();
  if (!isRouteErrorResponse(error)) {
    return null;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "100px",
      }}
    >
      <h1 className="text-3xl">Oops!</h1>
      <p>Sorry, an unexpected error has occurred</p>
      <p>
        <i>{error.message || error.status}</i>
      </p>
      <button onClick={() => navigate(-1)}> Click here to go back </button>
    </div>
  );
}
