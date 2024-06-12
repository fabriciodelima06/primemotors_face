'use client';

import ErrorPage from "@/components/root/ErrorPage";

const Error = ({ statusCode }) => {
   return <ErrorPage statusCode={statusCode} />;
};

Error.getInitialProps = ({ res, err }) => {
   const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
   return { statusCode };
};

export default Error;