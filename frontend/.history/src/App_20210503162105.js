import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar ,Typography, Button, IconButton, Grid, Checkbox, FormControlLabel} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import RobotsList from './RobotsList'
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  wholeGrid:{
    marginTop: '8%'
  },
  filterGrid: {
    marginLeft: "2%",
    position: "static"
  },
  listGrid: {
    marginLeft: "5%"
  }

}));


const RobotMarket = () => {
  const classes = useStyles();
  const [robots, setRobots] = React.useState([]);
  const [materialTypes, setMaterialTypes] = React.useState([])
  const [selectedMaterialType, setSelectedMaterialType] = React.useState()
  const [checked, setChecked] = React.useState(false)

    {/* fetching data from sever */}
    React.useEffect(() => {
      let url = `http://localhost:8000/api/robots`;
      let config = {
          method: 'GET',
          timeout: 1000 * 3,
          headers: {
              "Content-Type": "application/json"
          },
      };
      axios( url, config )
        .then(response => {
          if (response.status >= 200 && response.status <= 299) {
              console.log(response.data.data)
              
              // fetching material type without duplicating
              const testSet = new Set()
              for (let i= 0; i< response.data.data.length; i ++) {
                testSet.add(response.data.data[i].material)
              }
              let arr = Array.from(testSet);
              setMaterialTypes(arr)

              setRobots(response.data.data)  
          }
        })
        .catch(err => {
            console.log(err.message)
        });
    }, [])

    const handleChange = (event) => {
      setChecked(event.target.checked)
    } 
    
  
  return (

    <div className={classes.root}>

      {/* Menu top bar */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="secondary"  >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" className={classes.title}>
            Welcome to Robert Market
          </Typography>
          
          <Button color="inherit">Login</Button>

          {/* Shopping cart */}
          <IconButton>
            <ShoppingCartOutlinedIcon color="secondary" />
          </IconButton> 
        </Toolbar>
      </AppBar>

      <div>
        <Grid container spacing={1} className={classes.wholeGrid}>

          {/* Side bar (filter) */}
          <Grid item xs={1} className={classes.filterGrid}>
            <Typography>Filter </Typography>
              {materialTypes.map((materialType) => (
                <FormControlLabel
                  label={materialType}
                  control={
                    <Checkbox 
                      checked={checked}
                      size="small"
                      onChange={(e) => handleChange(e)} 
                      name={materialType}
                    />
                  }
                />
              ))}
          </Grid>

          {/* Robot lists */}
          <Grid container  xs={9}  spacing={2} className={classes.listGrid}>
            {robots && robots.map((robot) => (
              <Grid item xs={4}>
                <RobotsList
                  robot={robot}
                />
              </Grid>
            ))}
          </Grid>



        </Grid>
      </div>




    </div>


  )
}

export default RobotMarket;
