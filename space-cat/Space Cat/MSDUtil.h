//
//  MSDUtil.h
//  Space Cat
//
//  Created by Matthew Dobson on 7/21/14.
//  Copyright (c) 2014 Matthew Dobson. All rights reserved.
//

#import <Foundation/Foundation.h>

static const int MSDProjectileSpeed = 400;
static const int MSDSpaceDogMinSpeed = -100;
static const int MSDSpaceDogMaxSpeed = -50;
static const int MSDMaxLives = 4;
static const int MSDPointsPerHit = 100;

typedef NS_OPTIONS(uint32_t, MSDCollisionCategory) {
    MSDCollisionCategoryEnemy       = 1 << 0, // 0000
    MSDCollisionCategoryProjectile  = 1 << 1, // 0010
    MSDCollisionCategoryDebris      = 1 << 2, // 0100
    MSDCollisionCategoryGround      = 1 << 3  // 1000
};

@interface MSDUtil : NSObject

+ (NSInteger) randomWithMin:(NSInteger)min max:(NSInteger)max;

@end
