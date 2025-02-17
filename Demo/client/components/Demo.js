import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  DropdownButton,
  Dropdown,
  Button,
  Card,
  Container,
  Row,
  Col,
  Form,
  FormLabel,
} from 'react-bootstrap';
import Query from './Query';
import Metrics from './Metrics';
import Footer from './Footer.js';
// import DacheQL from '../../../library/dacheql';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPiggyBank } from '@fortawesome/free-solid-svg-icons';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

//counter to keep track for our incrementer function globally declared
let counter = 0;

const Demo = () => {
  //react hook for whatever displaying the query in Selected query box but in html format
  const [query, setQuery] = useState('Select Query');

  //react hook for storing whichever button from the dropdown was selected
  const [output, setOutput] = useState('');

  //react hook that stores in state the actual query string
  const [queryString, setQueryString] = useState('');

  //react hook for the timer state comparing the diference will give us the time elapsed
  const [timeToFetch, setTimeToFetch] = useState([0, 0]);

  //cache fetch time
  const [cacheFetchTime, setCacheFetchTime] = useState([0]);

  //react hook for storing the state of whatever was fetched (will use to render on resulting query)
  const [result, setResult] = useState('');

  //states to see if the info was cached or not
  const [valorantCount, setValorantCount] = useState(0);
  const [pokemonCount, setPokemonCount] = useState(0);
  const [citiesCount, setCitiesCount] = useState(0);

  const [selectValorant, setSelectValorant] = useState(false);
  const [selectPokemon, setSelectPokemon] = useState(false);
  const [selectCities, setSelectCities] = useState(false);
  //react hook for building the chartjs graph
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  //this is gon hold all values of the times so that the line chart can know how to structure itself (data area)

  const [timeArray, setTimeArray] = useState([]);

  //react hook for a boolean value that the incrementor will accept
  const [booleanVal, setBooleanVal] = useState(true);

  //options for line chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      yAxes: {
        beginAtZero: true,
      },
    },
  };

  //everytime the timearray length changes we are rerendering the chart to account for that with new labels for nodes
  // useEffect for timeArray
  useEffect(() => {
    const labels = [];
    // if (timeArray[2] === 0) return;
    //dynamically updates the label for each node on line chart after the first uncached node
    for (let i = 0; i < timeArray.length; i++) {
      if (i === 0) {
        labels.push('Starting Point');
      } else if (i === 1 && timeArray[i] !== 0) {
        labels.push('Uncached Data');
      } else {
        labels.push('Cached data');
      }
    }

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Response Times',
          data: timeArray,
          border: 'rgb(26,72,186)',
          backgroundColor: 'rgba(26,72,186)',
          borderColor: 'rgb(26,72,186)',
          borderWidth: 3,
        },
      ],
    });
    console.log('useEffect timearray: ', timeArray);
    //console.log('chartdata length: ', Object.keys(chartData).length);
  }, [timeArray]);

  //instead of calling incremeneter inside the runquery we just call it everytime either of the times change

  useEffect(() => {
    incrementer(timeToFetch[1], cacheFetchTime[0], booleanVal);
  }, [timeToFetch]);

  useEffect(() => {
    incrementer(timeToFetch[1], cacheFetchTime[0], booleanVal);
  }, [cacheFetchTime]);

  // console.log('chartdata: ', chartData);

  //function to incremement a counter so that the first element of the array
  //is the uncached time and it isnt ever repeated
  const incrementer = (uncachedData, cachedData, bool) => {
    //control flow to check the state of the booleanval hook and then if its switched i will reassign counter to 0 to begin again
    if (bool === true) {
      counter = 0;
      setBooleanVal(false);
    }
    // console.log('counter ', counter);
    if (counter === 0) {
      console.log('counter in crementer 0');
    }
    if (counter < 1) {
      counter++;
    } else if (counter === 1) {
      setTimeArray((timeArray) => [...timeArray, uncachedData]);
      //console.log('timeArrayIncrementor: ', timeArray);
      counter++;
    } else {
      setTimeArray((timeArray) => [...timeArray, cachedData]);
      //console.log('timeArrayIncrementor: ', timeArray);
      counter++;
    }
  };
  //upon change of drop down after selection set new values for react states for etc...
  const handleChangeValorant = (event) => {
    console.log('last query: ', queryString);
    if (queryString) {
      setValorantCount(0);
      fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: 'CLEAR',
        }),
      });
    }
    // console.log(event.target.innerHTML);
    setTimeArray([]);
    setQuery(event.target.innerHTML);
    setOutput('Query For Valorant');
    // set selectValorant to be true, to display the selected effect in button
    setSelectValorant(true);
    // set the rest of select hook to be false
    setSelectCities(false);
    setSelectPokemon(false);
    setQueryString(`

    query  {
      valorant  {
        id
        name
        role
        ultimate
      }
    }
    `);
    setTimeToFetch([0, 0]);
    setCacheFetchTime([0]);
    //resets the time array when switching queries
    setTimeArray([0]);
    // setLabel([]);
    //reset the chart render to its original state
    setChartData({
      datasets: [],
    });
    setBooleanVal(true);
  };

  const handleChangePokemon = (event) => {
    console.log('last query: ', queryString);
    if (queryString) {
      setPokemonCount(0);
      fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: 'CLEAR',
        }),
      });
    }
    setTimeArray([]);
    setQuery(event.target.innerHTML);
    setOutput('Query For Pokemon');
    //set selectValorant to be true, to display the selected effect in button
    setSelectPokemon(true);
    // set the rest of select hook to be false
    setSelectCities(false);
    setSelectValorant(false);

    setQueryString(`
    query {
      pokemon  {
        id
        name
        type
        ability
      }
    }`);
    setTimeToFetch([0, 0]);
    setCacheFetchTime([0]);
    //resets the time array when switching queries
    setTimeArray([0]);
    //reset the chart render to its original state
    setChartData({
      datasets: [],
    });
    setBooleanVal(true);
  };

  const handleChangeCities = (event) => {
    // setTimeToFetch([timeToFetch, totalRunTime]);
    //console.log(event.target.innerHTML);
    console.log('last query: ', queryString);
    if (queryString) {
      setCitiesCount(0);
      fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: 'CLEAR',
        }),
      });
    }
    setQuery(event.target.innerHTML);
    setOutput('Query For Cities');
    //set selectValorant to be true, to display the selected effect in button
    setSelectCities(true);
    // set the rest of select hook to be false
    setSelectPokemon(false);
    setSelectValorant(false);
    setQueryString(`
    query {
      cities  {
        id 
        name
        population
        country_id
      }
    }`);
    setTimeToFetch([0, 0]);
    setCacheFetchTime([0]);
    //resets the time array when switching queries
    setTimeArray([0]);
    //reset the chart render to its original state
    setChartData({
      datasets: [],
    });
    setBooleanVal(true);
  };

  let startTime;
  let endTime;
  const runQuery = async () => {
    //react hook for the timer state comparing the diference will give us the time elapsed
    console.log('WHEN RUN QUERY: ', timeToFetch);
    console.log('timeToFetch: ', timeToFetch);
    //cache fetch time
    console.log('cacheFetchTime: ', cacheFetchTime);
    //react hook for storing the state of whatever was fetched (will use to render on resulting query)
    console.log('result: ', result);
    //states to see if the info was cached or not
    console.log('valorantCount: ', valorantCount);
    console.log('pokementCount: ', pokemonCount);
    console.log('citiesCount: ', citiesCount);
    console.log('chartData: ', chartData);
    console.log('timeArray: ', timeArray);
    console.log('booleanVal: ', booleanVal);

    if (selectValorant === true) {
      setValorantCount(valorantCount + 1);
    }
    if (selectPokemon === true) {
      setPokemonCount(pokemonCount + 1);
    }
    if (selectCities === true) {
      setCitiesCount(citiesCount + 1);
    }
    console.log('query string:', queryString);
    startTime = performance.now();
    await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: queryString,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        //update the second timer variable once fetch is finished
        // cache[queryString] = data;
        // console.log('cache:', cache);
        endTime = performance.now();
        const totalRunTime = endTime - startTime;
        //update the react hook state for timetofetch
        if (selectValorant === true && valorantCount >= 1) {
          setCacheFetchTime([totalRunTime]);
          setResult(JSON.stringify(data, null, 2));
          return;
        }
        if (selectPokemon === true && pokemonCount >= 1) {
          setCacheFetchTime([totalRunTime]);
          setResult(JSON.stringify(data, null, 2));
          return;
        }
        if (selectCities === true && citiesCount >= 1) {
          console.log('citiesCOunt', citiesCount);
          setCacheFetchTime([totalRunTime]);
          setResult(JSON.stringify(data, null, 2));
          return;
        }
        // setCacheFetchTime([totalRunTime]);
        // setResult(JSON.stringify(data, null, 2));
        setTimeToFetch([timeToFetch, totalRunTime]);
        // console.log('time to fetch: ', totalRunTime);
        setResult(JSON.stringify(data, null, 2));
        // console.log('result', result);
      })
      .catch((err) => console.log('error on demo runQuery', err));
    // console.log('time to fetch: ', totalRunTime);
  };

  return (
    <div className="demopage">
      <Navigation id="navbar"></Navigation>
      <div className="howto">
        <h1>Demo</h1>
        <ol>
          <li>Select a query you want to receive information for.</li>
          <li>Press Run Query and see the uncached fetch time.</li>
          <li>Press Run Query a second time and notice the cached runtime!</li>
          <p>
            {' '}
            <br></br> * It should be noted the first ever query will have a significantly higher
            runtime than the other first queries because it is establishing a connection.<br></br>
          </p>
        </ol>
      </div>
      <div className="card-container">
        <div className="demo-query-container">
          <div className="demo-query-btns btn-group-vertical">
            <Form>
              <FormLabel style={{ width: 'max-content', 'flex-direction': 'row' }}></FormLabel>
              <h4>Choose A Demo Query</h4>
              <Button className="demo-query-btn" href="#/action-1" onClick={handleChangeValorant}>
                <Form.Check
                  className="queries"
                  label="Query For Valorant"
                  type="radio"
                  checked={selectValorant}
                ></Form.Check>
              </Button>
              <Button className="demo-query-btn" href="#/action-2" onClick={handleChangePokemon}>
                <Form.Check
                  className="queries"
                  label="Query For Pokemon"
                  type="radio"
                  checked={selectPokemon}
                ></Form.Check>
              </Button>
              <Button className="demo-query-btn" href="#/action-3" onClick={handleChangeCities}>
                <Form.Check
                  className="queries"
                  label="Query For Cities"
                  type="radio"
                  checked={selectCities}
                ></Form.Check>
              </Button>
              <Button id="runQueBtn" onClick={runQuery}>
                {/* <img src={piggyIcon} width={25} height={40} /> */}
                <Row>
                  <Col id="piggy">
                    <FontAwesomeIcon icon={faPiggyBank}></FontAwesomeIcon>
                  </Col>
                  <Col>
                    {' '}
                    <p>Run Query</p>
                  </Col>
                </Row>
              </Button>
            </Form>
          </div>
        </div>
        <Row>
          <Col>
            <Card
              style={{ color: '#000', width: '30rem', height: '25rem', right: '10px' }}
              className="selected-query"
            >
              <Card.Body>
                <Card.Title className="selected-query">Selected Query:</Card.Title>

                <Card.Text className="selected-query">
                  <Query output={output} />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card
              className="result-query"
              style={{ color: '#000', width: '30rem', height: '25rem', top: '10px' }}
            >
              <Card.Body>
                <Card.Title className="result-query">Resulting Query:</Card.Title>
                <Card.Text className="result-query">
                  <pre>
                    <code>{result}</code>
                  </pre>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card
              style={{ color: '#000', width: '30rem', height: '15rem', top: '40px' }}
              className="metricsbox"
            >
              <Card.Body>
                <Card.Title className="metrics">Metrics</Card.Title>
                <Card.Text id="metricsbody">
                  <Metrics timeToFetch={timeToFetch} cacheFetchTime={cacheFetchTime} />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card
              style={{ color: '#000', width: '30rem', height: '15rem', top: '40px' }}
              className="graphbox"
            >
              <Card.Body>
                <Card.Title className="graph">Graph</Card.Title>
                <Card.Text id="linechart">
                  <Line options={options} data={chartData} />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      {/* <Footer></Footer> */}
    </div>
  );
};

export default Demo;
