import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar ,Typography, Button, IconButton, Grid, Card, CardActionArea, CardMedia, CardContent, CardActions, requirePropFactory} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#f5f5f5"
  }


}));


const RobotsList = ({robot, handleAddShoppingCart}) => {
  const classes = useStyles();
  const [stock, setStock] = React.useState(robot.stock)
  const [addBasketbtn, setAddBasketBtn] = React.useState(false)

  const handleAddBasket = (addedRobot) => {
    if (stock > 0) {
      handleAddShoppingCart(addedRobot)
      setStock(stock-1) 
    } else {
      setAddBasketBtn(true)
    }
  }

  
  return (

        <Card className={classes.root}>
          <CardActionArea>
              <CardMedia
                component="img"
                style = {{ height: 130}}
                className={classes.media}
                src={robot.image}
                title={robot.name}
              />
              <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                  {robot.name.substring(0,15)}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                    Price: ฿{robot.price}
                    <div/>
                    Stock: {stock}
                    <div/>
                    Created at: {new Date(robot.createdAt).toDateString()}
              </Typography>
              </CardContent>
          </CardActionArea>

          <CardActions>
              <Button 
                size="small" 
                variant="contained" 
                disabled={addBasketbtn} 
                onClick={() => handleAddBasket(robot)} 
                color="primary"
              >
                Add to Basket
              </Button>
          </CardActions>
        </Card>


      



  )
}

export default RobotsList;
