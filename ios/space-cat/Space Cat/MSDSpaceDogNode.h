//
//  MSDSpaceDogNode.h
//  Space Cat
//
//  Created by Matthew Dobson on 7/21/14.
//  Copyright (c) 2014 Matthew Dobson. All rights reserved.
//

#import <SpriteKit/SpriteKit.h>

typedef NS_ENUM(NSUInteger, MSDSpaceDogType) {
    MSDSpaceDogTypeA = 0,
    MSDSpaceDogTypeB = 1
};

@interface MSDSpaceDogNode : SKSpriteNode

@property (nonatomic) BOOL damaged;
@property (nonatomic) MSDSpaceDogType type;

+ (instancetype) spaceDogOfType:(MSDSpaceDogType)type;

@end
