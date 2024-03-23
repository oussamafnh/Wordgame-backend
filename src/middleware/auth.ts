import express from 'express';


export const requireLogin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Check if user is authenticated
    if ((req as any).isAuthenticated()) {
        // User is authenticated, proceed to the next middleware or route handler
        return next();
    } else {
        // User is not authenticated, return an unauthorized error
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
