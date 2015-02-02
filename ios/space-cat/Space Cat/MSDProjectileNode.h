//
//  MSDProjectileNode.h
//  Space Cat
//
//  Created by Matthew Dobson on 7/21/14.
//  Copyright (c) 2014 Matthew Dobson. All rights reserved.
//

#import <SpriteKit/SpriteKit.h>

@interface MSDProjectileNode : SKSpriteNode

+ (instancetype) projectileAtPosition:(CGPoint) position;
- (void) moveTowardsPosition:(CGPoint)position;

@end
