import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import { PieChart, Pie, Tooltip, Selector, Cell } from "recharts";

const useStyles = makeStyles({
  table: {
    width: "500px",
    margin: "2rem auto",
    backgroundColor: "#fff",
  },
  paper: {
    // position: "absolute",
    width: 400,
    margin: "3rem auto",
    backgroundColor: "#fff",
    padding: "10px",
  },
});

export const TableMainContainer = () => {
  const classes = useStyles();
  const [table, setTable] = useState({});
  const [reviewData, setReviewData] = useState({});
  const [pieChartValueData, setPieChartValueData] = useState({});
  const [open, setOpen] = useState(false);
  console.log(table, pieChartValueData);

  useEffect(() => {
    axios
      .get(
        `https://front-end-technical-test-api.integration.eu.cloud.trustyou.net/review-distribution`
      )
      .then((res) => {
        let myObj = {};
        let pieChartObj = {};
        for (const obj in res.data.data) {
          myObj[obj] = Object.entries(res.data.data[obj]);
        }
        for (const pieObj in myObj) {
          pieChartObj[pieObj] = myObj[pieObj].map((pieValue) => {
            if (pieValue[0] !== "null") {
              return {
                name: pieValue[0],
                value: pieValue[1],
              };
            }
          });
        }
        setPieChartValueData(pieChartObj);
        setTable(myObj);
      });
  }, []);

  const getReviewHandler = (reviewType, value) => {
    const url = `https://front-end-technical-test-api.integration.eu.cloud.trustyou.net/reviews?filter_type=${reviewType}&filter_value=${value}`;

    axios.get(url).then((res) => {
      setReviewData(res.data);
      setOpen(true);
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <TableContainer component={Paper}>
      {Object.keys(table).map((x, index) => {
        if (x !== "overall_score") {
          return (
            <Table
              key={index}
              className={classes.table}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow style={{ backgroundColor: "bisque" }}>
                  <TableCell align="center">{x}</TableCell>
                </TableRow>
              </TableHead>
              {/* <TableBody key={index}>
                <PieChart width={400} height={400}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={pieChartValueData[x]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip />
                </PieChart>
              </TableBody> */}
              <TableBody key={index}>
                {table[x].map((y, index) => {
                  return (
                    <TableRow>
                      <TableCell align="center">
                        <Button
                          disabled={y[0] === "null" ? true : false}
                          onClick={() => {
                            getReviewHandler(x, y[0]);
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {y[0] === "null" ? "unKnown" : y[0]}
                        </Button>
                      </TableCell>
                      <TableCell align="center">{y[1]}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell align="center">
                    <PieChart width={400} height={400}>
                      <Pie
                        dataKey="value"
                        isAnimationActive={false}
                        data={pieChartValueData[x]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      />
                      <Tooltip />
                    </PieChart>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          );
        }
      })}
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <Typography align="right">
            <Button onClick={handleClose} variant="contained" color="primary">
              x
            </Button>
            {console.log(reviewData.data)}
            {reviewData?.data?.map((item) => {
              return (
                <div
                  style={{
                    margin: "2rem 1rem",
                    boxShadow: "2px 2px 8px #BFBFBF",
                    padding: "5px",
                  }}
                >
                  <Typography align="left" variant="body2">
                    Name: {item.guest_name}
                  </Typography>
                  <Typography align="left" variant="body2">
                    Emnai: {item.guest_email}
                  </Typography>
                  <Typography align="left" variant="body2">
                    Age: {item.guest_age}
                  </Typography>
                  <Typography align="left" variant="body2">
                    Date:{" "}
                    {new Date("05 October 2011 14:48 UTC").toISOString(
                      item.creation_date
                    )}
                  </Typography>
                </div>
              );
            })}
          </Typography>
        </div>
      </Modal>
    </TableContainer>
  );
};
