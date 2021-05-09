import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar ,Typography, Button, 
  IconButton, Grid, Checkbox, FormControlLabel, 
  List,ListItemText, ListItemSecondaryAction, 
  Card, Box, Divider } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import RobotsList from './RobotsList'
import axios from 'axios';
import Drawer from '@material-ui/core/Drawer';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';


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
    marginLeft: "3%"
  },
  paper: {
    width: '18%',
  },
  controlList: {
    margin: '5%'
  }

}));


const RobotMarket = () => {
  const classes = useStyles();
  const [robots, setRobots] = React.useState([]);
  const [materialTypes, setMaterialTypes] = React.useState([])
  const [selectedMaterialType, setSelectedMaterialType] = React.useState()
  const [checked, setChecked] = React.useState()
  const [drawer, setDrawer] = React.useState(false)
  const [shoppingCartList, setShoppingCartList] = React.useState([])
  const [itemCount, setItemCount] = React.useState()

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
      setChecked({ ...checked, [event.target.name]: event.target.checked });
    } 

    const handleAddShoppingCart = (addedRobot) => {

      //check if the addedRobot item already existed in the array
      const result = shoppingCartList.filter((val) => val.name == addedRobot.name)

      // if not exited, push new array of object
      if (result.length == [] ) {

        let arr = [...shoppingCartList]
        
        arr.push(addedRobot)


        let objIndex = arr.findIndex((obj) => obj.name == addedRobot.name);

        arr[objIndex].stock = arr[objIndex].stock - arr[objIndex].stock + 1
        setShoppingCartList(arr)

      } 
      //if already exited update the stock 
      else {

        console.log('already there')
        let arr = [...shoppingCartList]
        let objIndex = arr.findIndex((obj => obj.name == addedRobot.name));
        arr[objIndex].stock =  arr[objIndex].stock + 1
        setShoppingCartList(arr)
      }
    }

    const toggleDrawer = (event, toogleBool) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
      setDrawer(toogleBool);
    };

    const handleDrawerClose = () => {
      setDrawer(false)
    }


    
    const updateRobotsStock = (addedRobotObj) => {
      let objIndex2 = robots.findIndex((obj => obj.name == addedRobotObj.name));
      if (objIndex2 >= 0) {
        console.log('hello')
        robots[objIndex2].stock =  robots[objIndex2].stock - 1
      }
    }

    const addItem = (addedRobotObj) => {


        let objIndex = shoppingCartList.findIndex((obj => obj.name == addedRobotObj.name));
        let arr = [...shoppingCartList]
        let item = {...arr[objIndex]}
        item.stock = arr[objIndex].stock + 1
        arr[objIndex].stock = item.stock
        setShoppingCartList({arr})
        updateRobotsStock(addedRobotObj)


    }

    const subtractItem = (subtractedRobotObj) => {

      if (subtractedRobotObj.stock != 0) {
        let arr = [...shoppingCartList]
        let objIndex = arr.findIndex((obj => obj.name == subtractedRobotObj.name));
        arr[objIndex].stock =  arr[objIndex].stock - 1
        setShoppingCartList(arr)
      }

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
          <IconButton onClick={(event) => toggleDrawer(event, true)}>
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
                      onChange={handleChange} 
                      name={materialType}
                    />
                  }
                />
              ))}
          </Grid>

          {/* Robot lists */}
          <Grid container  xs={8}  spacing={2} className={classes.listGrid}>
            {robots && robots.map((robot) => (
              <Grid item xs={4}>
                <RobotsList
                  robot={robot}
                  handleAddShoppingCart={handleAddShoppingCart}
                />
              </Grid>
            ))}
          </Grid>

        </Grid>
      </div>

      {/* Right shopping cart drawer */}
          <Drawer 
            classes={{ paper: classes.paper }}
            variant="persistent" 
            anchor="right" 
            open={drawer} 
            onClose={(event) => toggleDrawer(event, false)}
          >
          <div className={classes.controlList}>
            <Box display="flex" flexDirection="row">
              <Typography variant="subtitle1">Shopping cart</Typography>
              <IconButton onClick={handleDrawerClose}>
                <ArrowForwardIcon/>
              </IconButton>
            </Box>

            <Divider></Divider>

            {shoppingCartList.map((robot, index) => (
              <List>
                <ListItemText
                  primary={robot.name.substring(0,10)}
                  secondary={`฿${robot.price}`}
                />

                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => addItem(robot)}>
                    <AddIcon />
                  </IconButton>

                  <IconButton color="primary">
                    <Typography>
                      {robot.stock}
                    </Typography>
                  </IconButton>

                
                  <IconButton edge="end" onClick={() => subtractItem(robot)}>
                    <RemoveIcon />
                  </IconButton>

                </ListItemSecondaryAction>

              </List>

            ))}
                

          </div>
          </Drawer>





    </div>


  )
}

export default RobotMarket;
