/*

 Easing functions

*/
export default class Ease
{
	static InOutCubic(t)
	{
		return t < 0.5 ? 4 * t * t * t : 4 * (t-1) * (t-1) * (t-1) + 1;
	}
	
    static InCubic(t)
    {
        return t * t * t;
    }

    static OutCubic(t)
    {
        return (t-1) * (t-1) * (t-1) + 1;
    }

    static InOutQuadratic(t) 
    {
        return t < 0.5 ? 2 * t * t : 1 - 2 * (t-1) * (t-1);
    }

    static InQuadratic(t)
    {
        return t * t;
    }

    static OutQuadratic(t)
    {
        return (t-1) * (1-t) + 1;
    }
}



