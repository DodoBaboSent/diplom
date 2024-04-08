import { Link, useMatches } from "react-router-dom";
import ArrowImg from "../assets/arrow-sm-right-svgrepo-com.svg";

export function Breadcrumbs() {
  let matches = useMatches();
  let crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match) => Boolean((match.handle as { crumb?: any }).crumb))
    // now map them into an array of elements, passing the loader
    // data to each one
    .map((match) => (match.handle as { crumb: any }).crumb(match.data));

  const sizeArrow = 15;

  return (
    <ol className={`flex flex-row gap-3`}>
      <li>
        <Link to="/">Home</Link>
      </li>
      {crumbs.length != 0 ? (
        <>
          {" "}
          <img
            src={ArrowImg}
            alt="arrow-breadcrumb"
            width={sizeArrow}
            height={sizeArrow}
          />
        </>
      ) : (
        <></>
      )}
      {crumbs.map((crumb, index, arr) => {
        if (index < arr.length - 1) {
          return (
            <>
              <li key={index}>{crumb}</li>
              <img
                src={ArrowImg}
                alt="arrow-breadcrumb"
                width={sizeArrow}
                height={sizeArrow}
              />
            </>
          );
        } else {
          return (
            <>
              <li key={index}>{crumb}</li>
            </>
          );
        }
      })}
    </ol>
  );
}

export default Breadcrumbs;
