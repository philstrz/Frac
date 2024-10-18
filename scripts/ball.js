import Globals from "./globals.js";
import { paddle, opponent, scores } from "./main.js";
import Coroutine from "./utilities/coroutine.js";
import Ease from "./utilities/ease.js";


//let theta = 0;
const initial = 500;
const final = 200;

const size = 16;
const squashAmount = 0.125;
const squashTimeScale = 60;

let camera = null;

const direction = 
{
	up: "up",
	down: "down",
	left: "left",
	right: "right",
};

class Ball extends globalThis.InstanceType.Ball
{
	speed = initial;
	theta = 0;
	squashing = false;

	constructor()
	{
		super();
		
		if (!camera) camera = this.runtime.objects.Camera.getFirstInstance();
	}
	
	Update()
	{
		if (this.squashing) return;
		
		const theta = this.theta * Math.PI / 180;
		this.x += Math.cos(theta) * this.runtime.dt * this.speed;
		this.y += Math.sin(theta) * this.runtime.dt * this.speed;
		
		this.CheckBounds();
		this.CheckLeft();
		this.CheckRight();
		
		if (this.speed == initial)
		{
			this.drawTrail();
		}
	}
	
	drawTrail()
	{
		this.runtime.objects.BallTrail.createInstance("Pong", this.x, this.y);
	}
	
	// Immediately after ball is created, set its initial direction
	Set(fraction)
	{	
		// ball position minus the point where it should hit the paddle
		const x = (Globals.ball.left + Globals.offset.x) - this.x;
		const y = (fraction * ( Globals.paddle.top - Globals.paddle.bottom ) + Globals.paddle.bottom + Globals.offset.y) - this.y;
		// convert to angle, in degrees
		this.theta = Math.atan2(y, x) * 180 / Math.PI;
	}
	
	// Check if the ball is at the top or bottom of the game
	CheckBounds()
	{
		const top = Globals.offset.y + Globals.ball.top;
		const bottom = Globals.offset.y + Globals.ball.bottom;
		
		if (this.y < top)
		{
			/*
			const delta = top - this.y;
			this.y = top + delta;
			*/
			this.y = top;
			
			this.theta = - this.theta;
			//new Coroutine(this.squash(direction.up), "squash");
		}
		if (this.y > bottom)
		{
			/*
			const delta = this.y - bottom;
			this.y = bottom - delta;
			*/
			this.y = bottom;
			
			this.theta = - this.theta;
			//new Coroutine(this.squash(direction.down), "squash");
		}
	}
	
	// Check if the ball has reached the paddle and if the paddle is there
	CheckLeft()
	{
		const left = Globals.offset.x + Globals.ball.left;
		
		if (this.x < left)
		{
			if (this.y >= paddle.y - Globals.paddle.reach && this.y <= paddle.y + Globals.paddle.reach)
			{
				/*
				const delta = left - this.x;
				this.x = left + delta;
				*/
				this.x = left;
				
				this.theta = 2 * ( this.y - paddle.y );
				
				// Squash
				new Coroutine(this.squash(direction.left, this.speed / initial), "squash");
				
				// Boop
				camera.boop(-5 * this.speed / initial, 0, 0.25);
				
				// Reduce speed after first hit
				this.speed = final;
				
				
				
			}
			else
			{
				this.explode();
				camera.shake(10, 0.5);
				scores.opponent += 1;
			}
		}
	}
	
	
	// Check the right side, if there's a paddle there
	CheckRight()
	{
		const right = Globals.offset.x + Globals.ball.right;
		
		if (this.x > right)
		{
			if (this.y >= opponent.y - Globals.paddle.reach && this.y <= opponent.y + Globals.paddle.reach)
			{
				/*
				const delta = this.x - right;
				this.x = right - delta;
				*/
				this.x = right;

				this.theta = 180 - this.theta;
				
				// Squash
				new Coroutine(this.squash(direction.right, this.speed / initial), "squash");
			}
			else
			{
				scores.player += 1;
				console.log(scores.player, scores.opponent);
				this.explode();
			}
			
		}
	}
	
	// Leave an explosion particle effect and destroy the ball
	explode()
	{
		const explode = this.runtime.objects.Explode.createInstance("Pong", this.x, this.y, true);
		this.destroy()
	}
	
	* squash (dir, scale)
	{
		this.squashing = true;
		
		const anchor = 
		{
			x: this.x,
			y: this.y,
		};
		
		let t = 0
		while ( t < 1 )
		{
			const f = Ease.OutCubic(t);
			//console.log(t, f);
			this.squeeze(dir, f * scale, anchor);
			t += this.runtime.dt * squashTimeScale;
			yield;
		}
		
		t = 1;
		this.squeeze(dir, t, anchor);
		yield;
		
		while ( t > 0 )
		{
			const f = Ease.OutCubic(t);
			//console.log(t, f);
			this.squeeze(dir, f * scale, anchor);
			t -= this.runtime.dt * squashTimeScale;
			yield;
		}
		this.squeeze(dir, 0, anchor);
		this.squashing = false;
		return;
	}
	
	squeeze(dir, amount, anchor)
	{
		switch (dir)
		{
			case direction.down:
				this.height = size * (1 - squashAmount * amount);
				this.width = size / (1 - squashAmount * amount);
				this.y = anchor.y + (squashAmount * amount) * size / 2;
				break;
			case direction.up:
				this.height = size * (1 - squashAmount * amount);
				this.width = size / (1 - squashAmount * amount);
				this.y = anchor.y - (squashAmount * amount) * size / 2;
				break;
			case direction.left:
				this.width = size * (1 - squashAmount * amount);
				this.height = size / (1 - squashAmount * amount);
				this.x = anchor.x - (squashAmount * amount) * size;
				paddle.object.x = paddle.x - (squashAmount * amount) * size / 2;
				break;
			case direction.right:
				this.width = size * (1 - squashAmount * amount);
				this.height = size / (1 - squashAmount * amount);
				this.x = anchor.x + (squashAmount * amount) * size;
				opponent.object.x = opponent.x + (squashAmount * amount) * size / 2;
				break;
			
		}
	}
	
}

export default Ball;
