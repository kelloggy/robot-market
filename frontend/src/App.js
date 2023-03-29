import * as React from 'react';
import { useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  AppBar,
  Toolbar,
  Typography,
  Button, 
  IconButton,
  Grid,
  Checkbox,
  FormControlLabel, 
  List,
  ListItemText,
  ListItemSecondaryAction, 
  Box, 
  Divider, 
} from '@material-ui/core';
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

function robotsReducer(robots, action) {
  switch (action.type) {
    case 'FETCH_SUCCESS': {
      return [
        ...action.robots
      ];
    }
    case 'FILTERED_ROBOTS': {
      return [
        ...action.robots
      ]
    } 
    case 'UPDATE_ROBOTS_STOCK': {
      return robots.map((r) => {
        if(r.name === action.robot.name) {
          return {
            ...r,
            stock: action.updateType === 'subtract' ? r.stock - 1 : r.stock + 1
          }
        }
        return r
      })
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

function shoppingCartListReducer(shoppingCartList, action) {
  switch (action.type) {
    case 'ADD_SHOPPING_CART': {
      const result = { ...action.robot, stock: 1 };
      return [
        ...shoppingCartList,
        result
      ]
    }
    case 'UPDATE_SHOPPING_CART': {
      return shoppingCartList.map((s) => {
        if(s.name === action.robot.name) {
          return {
            ...s,
            stock: action.updateType === 'added' ? s.stock + 1 : s.stock - 1
          }
        }
        return s
      })
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const RobotMarket = () => {
  const classes = useStyles();
  const [robots, dispatch] = useReducer(robotsReducer, []);
  const [materialTypes, setMaterialTypes] = React.useState([])
  const [selectedMaterialType, setSelectedMaterialType] = React.useState()
  const [drawer, setDrawer] = React.useState(false)
  const [shoppingCartList, shoppingCartListDispatch] = useReducer(shoppingCartListReducer, [])
  const [filterArr, setFilterArr] = React.useState([])
  const [temp, setTemp] = React.useState([])
  const [robotsMaterialTypeHashMap, setRobotsMaterialTypeHashMap] = React.useState(new Map([]))

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
              dispatch({type: 'FETCH_SUCCESS', robots: response.data.data})
              setTemp(response.data.data)

              // fetching material type without duplicating
              // hashMap materialType => [robotObj, robotObj ]
              const testSet = new Set()
              for (let i= 0; i< response.data.data.length; i ++) {
                const currentRobotObj = response.data.data[i]
                const currentRobotMaterialType = response.data.data[i].material
                testSet.add(currentRobotMaterialType)

                if (robotsMaterialTypeHashMap.has(currentRobotMaterialType)) {
                  robotsMaterialTypeHashMap.get(currentRobotMaterialType).push(currentRobotObj)
                } else {
                  robotsMaterialTypeHashMap.set(currentRobotMaterialType, [currentRobotObj])
                }
              }
              let arr = Array.from(testSet);
              setMaterialTypes(arr)
            }
        })
        .catch(err => {
            console.log(err.message)
        });
    }, [])

    React.useEffect(() => {
      if(filterArr.length > 0) {
        let filteredRobots = [];
        filterArr.map((f) => {
          filteredRobots = [...robotsMaterialTypeHashMap.get(f)]
          return f
        })
        dispatch({type: 'FILTERED_ROBOTS', robots: filteredRobots})
      } else {
        dispatch({type: 'FILTERED_ROBOTS', robots: temp})
      }
    },[filterArr])


    const handleCheckboxChange = (isChecked, materialType) => {
      if (isChecked === true) {
        setFilterArr(((prevArray) => [...prevArray, materialType]))
      } 
      else if (isChecked === false) {
        const foundIndex = filterArr.findIndex((fa) => fa === materialType);
        const arr = [...filterArr]
        arr.splice(foundIndex, 1)
        setFilterArr(arr)
      }
    } 

    const handleAddShoppingCart = (addedRobot) => {
      const foundRobotInShoppingCart = shoppingCartList.filter((val) => val.name === addedRobot.name)

      if (foundRobotInShoppingCart.length === 0 ) {
        shoppingCartListDispatch({type: 'ADD_SHOPPING_CART', robot: addedRobot})
      } 
      else {
        shoppingCartListDispatch({type: 'UPDATE_SHOPPING_CART', robot: addedRobot, updateType: 'added'})
      }

      dispatch({type: 'UPDATE_ROBOTS_STOCK', robot: addedRobot, updateType: 'subtract'})
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

    const addItem = (addedRobotObj, shoppingCartListIndex) => {
      let isOutOfStock = false;
      robots.map((r) => {
        if(r.name === addedRobotObj.name && r.stock === 0) {
          alert("Out of stock")
          isOutOfStock = true
          return;
        }
      })

      if(isOutOfStock === true) {
        return
      }

      shoppingCartListDispatch({type: 'UPDATE_SHOPPING_CART', robot: addedRobotObj, updateType: 'added'})
      dispatch({type: 'UPDATE_ROBOTS_STOCK', robot: addedRobotObj, updateType: 'subtract'})
    }

    const subtractItem = (subtractedRobotObj) => {
      shoppingCartListDispatch({type: 'UPDATE_SHOPPING_CART', robot: subtractedRobotObj, updateType: 'subtract'})
      dispatch({type: 'UPDATE_ROBOTS_STOCK', robot: subtractedRobotObj, updateType: 'added'})
    }
    
  return (

    <div>
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
          <Grid item xs={2} className={classes.filterGrid}>
            <Typography>Filter </Typography>
              {materialTypes.map((materialType) => {
                  const foundIndex = filterArr.findIndex((fa) => fa === materialType);
                  const alreadyCheck = foundIndex !== -1;
                  return (
                    <Box display="flex" flexDirection="row">
                        <FormControlLabel
                          label={materialType}
                          control={
                            <Checkbox
                                color="primary"
                                defaultChecked={false}
                                checked={alreadyCheck}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    handleCheckboxChange(isChecked, materialType);
                                }}
                            />
                          }
                        />
                    </Box>
                  )
              })}
          </Grid>

          {/* Robot lists */}
          <Grid container  xs={8}  spacing={2} className={classes.listGrid}>
            {robots && robots.map((robot, index) => (
              <Grid item xs={4}>
                <div key={index}>
                  <RobotsList
                    robot={robot}
                    handleAddShoppingCart={handleAddShoppingCart}
                  />
                </div>
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
            <IconButton className={classes.drawerArrow} onClick={handleDrawerClose}>
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
                <IconButton 
                  edge="end" 
                  onClick={() => addItem(robot, index)}
                >
                  <AddIcon />
                </IconButton>

                <IconButton color="primary">
                  <Typography>
                    {robot.stock}
                  </Typography>
                </IconButton>

                <IconButton 
                  edge="end" 
                  disabled={robot.stock === 0 ? true : false} 
                  onClick={() => subtractItem(robot, index)}
                >
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