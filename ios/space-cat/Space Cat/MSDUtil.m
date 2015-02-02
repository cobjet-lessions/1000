//
//  MSDUtil.m
//  Space Cat
//
//  Created by Matthew Dobson on 7/21/14.
//  Copyright (c) 2014 Matthew Dobson. All rights reserved.
//

#import "MSDUtil.h"

@implementation MSDUtil

+ (NSInteger) randomWithMin:(NSInteger)min max:(NSInteger)max {
    return arc4random() % (max - min) + min;
}

@end
