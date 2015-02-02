//
//  MSDGroundNode.m
//  Space Cat
//
//  Created by Matthew Dobson on 7/21/14.
//  Copyright (c) 2014 Matthew Dobson. All rights reserved.
//

#import "MSDGroundNode.h"
#import "MSDUtil.h"

@implementation MSDGroundNode

+ (instancetype) groundWithSize:(CGSize)size {
    MSDGroundNode *ground = [self spriteNodeWithColor:[SKColor clearColor] size:size];
    
    ground.name = @"Ground";
    ground.position = CGPointMake(size.width / 2, size.height / 2);
    [ground setupPhysicsBody];
    return ground;
}

-(void) setupPhysicsBody {
    self.physicsBody = [SKPhysicsBody bodyWithRectangleOfSize:self.frame.size];
    self.physicsBody.affectedByGravity = NO;
    self.physicsBody.dynamic = NO;
    self.physicsBody.categoryBitMask = MSDCollisionCategoryGround;
    self.physicsBody.collisionBitMask = MSDCollisionCategoryDebris;
    self.physicsBody.contactTestBitMask = MSDCollisionCategoryEnemy;
}

@end
