import React from "react";

class ErrorPage extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
  }

  render() {
    const { statusCode } = this.props;
    return (
      <div style={styles.error}>
        <div style={styles.desc}>
          <h1 style={styles.h1}>{statusCode || "Error"}</h1>
          <div style={styles.wrap}>
            <h2 style={styles.h2}>
              {statusCode === 404 ? "页面不存在" : "服务器错误"}
            </h2>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  error: {
    fontFamily: 'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
    height: "100vh",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a",
    color: "#e2e8f0",
  },
  desc: { lineHeight: "48px" },
  h1: {
    display: "inline-block",
    margin: "0 20px 0 0",
    paddingRight: 23,
    fontSize: 24,
    fontWeight: 500,
    verticalAlign: "top",
    borderRight: "1px solid rgba(255,255,255,0.3)",
  },
  h2: { fontSize: 14, fontWeight: 400, lineHeight: "28px" },
  wrap: { display: "inline-block" },
};

export default ErrorPage;
