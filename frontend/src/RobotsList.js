import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Typography,
  Button,
  Card, 
  CardActionArea, 
  CardMedia,
  CardContent, 
  CardActions, 
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#f5f5f5"
  }
}));


const RobotsList = ({robot, handleAddShoppingCart}) => {
  const classes = useStyles();
  const [addBasketBtnDisabled, setAddBasketBtnDisabled] = React.useState(false)

  React.useEffect(() => {
    if (robot.stock > 0) {
      setAddBasketBtnDisabled(false);
    } else {
      setAddBasketBtnDisabled(true);
    }
  }, [robot.stock]);

  const handleAddBasket = (addedRobot) => {
    if (robot.stock > 0) {
      handleAddShoppingCart(addedRobot)
    } else {
      setAddBasketBtnDisabled(true)
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
              {robot.name.substring(0,10)}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
                Price: ฿{robot.price}
                <div/>
                Stock: {robot.stock}
                <div/>
                Created at: {new Date(robot.createdAt).toDateString()}
          </Typography>
          </CardContent>
      </CardActionArea>

      <CardActions>
          <Button 
            size="small" 
            variant="contained" 
            disabled={addBasketBtnDisabled} 
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
