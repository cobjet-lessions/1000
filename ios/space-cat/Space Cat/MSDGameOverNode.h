//
//  MSDGameOverNode.h
//  Space Cat
//
//  Created by Matthew Dobson on 7/22/14.
//  Copyright (c) 2014 Matthew Dobson. All rights reserved.
//

#import <SpriteKit/SpriteKit.h>

@interface MSDGameOverNode : SKNode

+ (instancetype) gameOverAtPosition:(CGPoint)position;

- (void) performAnimation;

@end
