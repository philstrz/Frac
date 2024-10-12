/*

A reusable set of tools, like easing functions on [0,1]

*/

class Utilities
{
	// Easing functions
	static EaseInOutCubic(t)
	{
		return t < 0.5 ? 4 * t * t * t : 4 * (t-1) * (t-1) * (t-1) + 1;
	}
	
    static EaseInCubic(t)
    {
        return t * t * t;
    }

    static EaseOutCubic(t)
    {
        return (t-1) * (t-1) * (t-1) + 1;
    }

    static EaseInOutQuadratic(t) 
    {
        return t < 0.5 ? 2 * t * t : 1 - 2 * (t-1) * (t-1);
    }

    static EaseInQuadratic(t)
    {
        return t * t;
    }

    static EaseOutQuadratic(t)
    {
        return (t-1) * (1-t) + 1;
    }
}

export default Utilities;