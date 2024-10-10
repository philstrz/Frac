import { params } from "./params.js";
import { paddle } from "./main.js";

class Ball extends globalThis.InstanceType.Ball
{
	speed = 100;
	theta = 0;

	constructor()
	{
		super();
	}
	
	Update()
	{
		const theta = this.theta * Math.PI / 180;
		this.x += Math.cos(theta) * this.runtime.dt * this.speed;
		this.y += Math.sin(theta) * this.runtime.dt * this.speed;
		
		this.CheckBounds();
		this.CheckLeft();
		this.CheckRight();
	}
	
	// Immediately after ball is created, set its initial direction
	Set(angle)
	{
		this.theta = angle;
	}
	
	// Check if the ball is at the top or bottom of the game
	CheckBounds()
	{
		const top = params.offset.y + params.ball.top;
		const bottom = params.offset.y + params.ball.bottom;
		
		if (this.y < top)
		{
			const delta = top - this.y;
			this.y = top + delta;
			
			this.theta = - this.theta
		}
		if (this.y > bottom)
		{
			const delta = this.y - bottom;
			this.y = bottom - delta;
			
			this.theta = - this.theta;
		}
	}
	
	// Check if the ball has reached the paddle and if the paddle is there
	CheckLeft()
	{
		const left = params.offset.x + params.ball.left;
		
		if (this.x < left)
		{
			if (this.y >= paddle.y - params.paddle.reach && this.y <= paddle.y + params.paddle.reach)
			{
				const delta = left - this.x;
				this.x = left + delta;
				
				console.log(this.theta);
				this.theta = 180 - this.theta;
			}	
		}
	}
	
	// Check the right side, if there's a paddle there
	CheckRight()
	{
		const right = params.offset.x + params.ball.right;
		
		if (this.x > right)
		{
			const delta = this.x - right;
			this.x = right - delta;
			
			console.log(this.theta);
			this.theta = 180 - this.theta;
		}
	}
}

export default Ball;
